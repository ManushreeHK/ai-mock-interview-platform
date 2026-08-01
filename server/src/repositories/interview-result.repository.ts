import {
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { documentClient } from "../config/dynamodb.js";
import { env } from "../config/env.js";
import type {
  CreateInterviewResult,
  InterviewResult,
} from "../models/interview-result.js";

export type InterviewHistoryCursor = {
  userId: string;
  interviewId: string;
};

export type InterviewHistoryQueryResult = {
  items: Record<string, unknown>[];
  lastEvaluatedKey?: InterviewHistoryCursor;
};

export function buildInterviewHistoryQuery(
  userId: string,
  limit: number,
  cursor?: InterviewHistoryCursor
) {
  return {
    TableName: env.interviewsTableName,
    KeyConditionExpression: "#userId = :userId",
    ExpressionAttributeNames: {
      "#userId": "userId",
      "#interviewId": "interviewId",
      "#createdAt": "createdAt",
      "#role": "role",
      "#type": "type",
      "#difficulty": "difficulty",
      "#status": "status",
      "#evaluation": "evaluation",
      "#overallScore": "overallScore",
      "#communication": "communication",
      "#technicalKnowledge": "technicalKnowledge",
      "#confidence": "confidence",
    },
    ExpressionAttributeValues: { ":userId": userId },
    ProjectionExpression:
      "#interviewId, #createdAt, #role, #type, #difficulty, #status, " +
      "#evaluation.#overallScore, #evaluation.#communication, " +
      "#evaluation.#technicalKnowledge, #evaluation.#confidence",
    ExclusiveStartKey: cursor,
    ScanIndexForward: false,
    Limit: limit,
  };
}

export async function saveInterviewResult(
  input: CreateInterviewResult
): Promise<InterviewResult> {
  const createdAt = new Date().toISOString();
  const result: InterviewResult = {
    ...input,
    interviewId: `${createdAt}#${randomUUID()}`,
    status: "completed",
    createdAt,
  };

  await documentClient.send(
    new PutCommand({
      TableName: env.interviewsTableName,
      Item: result,
      ConditionExpression:
        "attribute_not_exists(userId) AND attribute_not_exists(interviewId)",
    })
  );

  return result;
}

export async function getInterviewResultsByUser(
  userId: string,
  limit: number,
  cursor?: InterviewHistoryCursor
): Promise<InterviewHistoryQueryResult> {
  const response = await documentClient.send(
    new QueryCommand(buildInterviewHistoryQuery(userId, limit, cursor))
  );

  const lastEvaluatedKey = response.LastEvaluatedKey;

  return {
    items: response.Items ?? [],
    lastEvaluatedKey:
      typeof lastEvaluatedKey?.userId === "string" &&
      typeof lastEvaluatedKey.interviewId === "string"
        ? {
            userId: lastEvaluatedKey.userId,
            interviewId: lastEvaluatedKey.interviewId,
          }
        : undefined,
  };
}
