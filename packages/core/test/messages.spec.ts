import "mocha";
import { getDefaultLoggerOptions } from "@walletconnect/logger";
import pino from "pino";
import Sinon from "sinon";

import {
  Core,
  CORE_DEFAULT,
  CORE_STORAGE_PREFIX,
  MESSAGES_CONTEXT,
  MESSAGES_STORAGE_VERSION,
  MessageTracker,
} from "../src";
import { expect, TEST_CORE_OPTIONS } from "./shared";
import { generateRandomBytes32, hashMessage } from "@walletconnect/utils";

describe("Messages", () => {
  const logger = pino(getDefaultLoggerOptions({ level: CORE_DEFAULT.logger }));

  let messageTracker: MessageTracker;
  let topic: string;

  beforeEach(async () => {
    const core = new Core(TEST_CORE_OPTIONS);
    messageTracker = new MessageTracker(logger, core);
    topic = generateRandomBytes32();
    await messageTracker.init();
  });

  it("provides the expected `storageKey` format", () => {
    expect(messageTracker.storageKey).to.equal(
      CORE_STORAGE_PREFIX + MESSAGES_STORAGE_VERSION + "//" + MESSAGES_CONTEXT,
    );
  });

  // describe("init", () => {});

  describe("set", () => {
    it("throws if not initialized", async () => {
      const invalidMessageTracker = new MessageTracker(logger, new Core(TEST_CORE_OPTIONS));
      await expect(invalidMessageTracker.set(topic, "some message")).to.eventually.be.rejectedWith(
        "messages was not initialized",
      );
    });
    it("sets an entry on the messages map for a new topic-message pair", async () => {
      const mockMessage = "test message";
      await messageTracker.set(topic, mockMessage);
      const key = hashMessage(mockMessage);
      const message = messageTracker.messages.get(topic) ?? {};
      expect(message[key]).to.equal(mockMessage);
    });
  });

  describe("get", () => {
    it("throws if not initialized", () => {
      const invalidMessageTracker = new MessageTracker(logger, new Core(TEST_CORE_OPTIONS));
      expect(() => invalidMessageTracker.get(topic)).to.throw("messages was not initialized");
    });
    it("returns an empty object for an unknown topic", () => {
      const message = messageTracker.get("fakeTopic");
      expect(message).to.deep.equal({});
    });
    it("returns the expected message based on the topic", async () => {
      const mockMessage = "test message";
      await messageTracker.set(topic, mockMessage);
      expect(messageTracker.get(topic)).to.deep.equal({ [hashMessage(mockMessage)]: mockMessage });
    });
  });

  // describe("has");
  // describe("del");
});
