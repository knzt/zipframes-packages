import { describe, expect, it } from "vitest";

import {
  ApplicationError,
  BaseError,
  DomainError,
  InfrastructureError,
  isBaseError,
} from "../src/errors/index.js";

describe("DomainError", () => {
  it("holds code, message and origin", () => {
    const error = new DomainError("INVALID_EMAIL", "email has an invalid format");

    expect(error.code).toBe("INVALID_EMAIL");
    expect(error.message).toBe("email has an invalid format");
    expect(error.kind).toBe("domain");
    expect(error.name).toBe("DomainError");
  });

  it("is still an Error", () => {
    const error = new DomainError("X", "y");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(BaseError);
    expect(error.stack).toBeDefined();
  });
});

describe("kind per error type", () => {
  it("tells the three origins apart", () => {
    expect(new DomainError("A", "a").kind).toBe("domain");
    expect(new ApplicationError("B", "b").kind).toBe("application");
    expect(new InfrastructureError("C", "c").kind).toBe("infrastructure");
  });
});

describe("details and cause", () => {
  it("holds details when they are given", () => {
    const error = new ApplicationError("VIDEO_NOT_FOUND", "video not found", {
      details: { videoId: "abc" },
    });

    expect(error.details).toEqual({ videoId: "abc" });
  });

  it("leaves details undefined when they are not given", () => {
    expect(new ApplicationError("X", "y").details).toBeUndefined();
  });

  it("preserves the original cause", () => {
    const original = new Error("connection refused");
    const error = new InfrastructureError("BROKER_UNAVAILABLE", "broker unavailable", {
      cause: original,
    });

    expect(error.cause).toBe(original);
  });
});

describe("toJSON", () => {
  it("serializes without details when there are none", () => {
    expect(new DomainError("INVALID_STATUS", "invalid transition").toJSON()).toEqual({
      name: "DomainError",
      kind: "domain",
      code: "INVALID_STATUS",
      message: "invalid transition",
    });
  });

  it("includes details when there are some", () => {
    const error = new DomainError("INVALID_STATUS", "invalid transition", {
      details: { from: "DONE", to: "PROCESSING" },
    });

    expect(error.toJSON()).toEqual({
      name: "DomainError",
      kind: "domain",
      code: "INVALID_STATUS",
      message: "invalid transition",
      details: { from: "DONE", to: "PROCESSING" },
    });
  });
});

describe("service subclasses", () => {
  class VideoNotFoundError extends ApplicationError {
    constructor(videoId: string) {
      super("VIDEO_NOT_FOUND", "video not found", { details: { videoId } });
    }
  }

  it("inherit the origin and get their own name", () => {
    const error = new VideoNotFoundError("abc");

    expect(error.name).toBe("VideoNotFoundError");
    expect(error.kind).toBe("application");
    expect(error).toBeInstanceOf(ApplicationError);
    expect(error.details).toEqual({ videoId: "abc" });
  });
});

describe("isBaseError", () => {
  it("recognizes errors from this package", () => {
    expect(isBaseError(new DomainError("A", "a"))).toBe(true);
    expect(isBaseError(new InfrastructureError("B", "b"))).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isBaseError(new Error("plain"))).toBe(false);
    expect(isBaseError("text")).toBe(false);
    expect(isBaseError(undefined)).toBe(false);
  });
});
