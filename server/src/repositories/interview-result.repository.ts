import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { documentClient } from "../config/dynamodb.js";
import { env } from "../config/env.js";
import type {
  CreateInterviewResult,
  InterviewResult,
} from "../models/interview-result.js";

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
