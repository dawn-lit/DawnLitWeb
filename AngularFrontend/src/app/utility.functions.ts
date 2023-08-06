import { DatabaseRecord } from "./utility.models";

export function getExistenceTime(content: DatabaseRecord): string {
  let timeDiff = (new Date().getTime() - new Date(content.createdAt).getTime()) / 1000;
  if (timeDiff >= 31536000) {
    return `${Math.round(timeDiff / 31536000)}yr`;
  } else if (timeDiff >= 2592000) {
    return `${Math.round(timeDiff / 2592000)}mon`;
  } else if (timeDiff >= 86400) {
    return `${Math.round(timeDiff / 86400)}d`;
  } else if (timeDiff >= 3600) {
    return `${Math.round(timeDiff / 3600)}hr`;
  }
  let minutes = Math.round(timeDiff / 60);
  return minutes > 0 ? `${minutes}min` : "Just now";
}

export function getDateString(date: Date): string {
  return new Date(date).toDateString();
}
