import { AuthEngineTypes } from "@walletconnect/auth-client";
import { JsonRpcResponse } from "@walletconnect/jsonrpc-utils";
import { ProposalTypes, SessionTypes } from "@walletconnect/types";
import { IWeb3WalletClient } from "./client";

export abstract class IWeb3WalletEngine {
  constructor(public client: IWeb3WalletClient) {}
  // ---------- Public Methods ------------------------------------------------- //
  public abstract init(): Promise<void>;

  // ---------- Sign ------------------------------------------------- //
  // approve a session proposal (SIGN)
  public abstract approveSession(params: {
    id: number;
    namespaces: Map<string, SessionTypes.Namespace>;
    relayProtocol?: string;
  }): Promise<SessionTypes.Struct>;

  // reject a session proposal (SIGN)
  public abstract rejectSession(params: {
    proposerPublicKey: string;
    reason: any; //Reason;
  }): Promise<void>;

  // update session namespaces (SIGN)
  public abstract updateSession(params: {
    topic: string;
    namespaces: Map<string, SessionTypes.Namespace>;
  }): Promise<void>;

  // update session expiry (SIGN)
  public abstract extendSession(params: { topic: string }): Promise<void>;

  // respond JSON-RPC request (SIGN)
  public abstract respondSessionRequest(params: {
    topic: string;
    response: JsonRpcResponse;
  }): Promise<void>;

  // emit session events (SIGN)
  public abstract emitSessionEvent(params: {
    topic: string;
    event: any; //SessionEvent;
    chainId: string;
  }): Promise<void>;

  // disconnect a session (SIGN)
  public abstract disconnectSession(params: { topic: string; reason: any }): Promise<void>; // create type Reason

  // query all active sessions (SIGN)
  public abstract getActiveSessions(): Promise<Record<string, SessionTypes.Struct>>;

  // query all pending session requests (SIGN)
  public abstract getPendingSessionProposals(): Promise<Record<number, ProposalTypes.Struct>>;

  // query all pending session requests (SIGN)
  public abstract getPendingSessionRequests(): Promise<Record<number, SessionTypes.Struct>>;

  // ---------- Auth ------------------------------------------------- //

  // respond Auth Request (AUTH)
  public abstract respondAuthRequest(
    params: AuthEngineTypes.RespondParams,
    iss: string,
  ): Promise<boolean>;

  // query all pending auth requests (AUTH)
  public abstract getPendingAuthRequests(): Promise<Record<number, AuthEngineTypes.PendingRequest>>;

  // format payload to message string
  public abstract formatMessage(
    payload: AuthEngineTypes.CacaoRequestPayload,
    iss: string,
  ): Promise<string>;
}
