import React from "react";

export const AccountCard = ({ account, onSave }) => {
  const formattedFollowers = account.followers >= 1000
    ? `${(account.followers / 1000).toFixed(1)}K`
    : `${account.followers}`;

  const engagement = account.engagementRate ? `${account.engagementRate}%` : "N/A";
  const matchPercent = `${account.matchScore}%`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-100" aria-hidden="true">
          <span className="text-sm font-medium">
            {account.username.split("@")[1]?.charAt(0) || "?"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-3 min-w-0">
            <a
              href={account.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium hover:underline truncate focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              @{account.username.replace("@","")}
            </a>
            <span className="text-xs text-gray-500 ml-2 truncate">
              {account.category} · {account.location}
            </span>
          </div>
          <p className="text-sm line-clamp-3 text-gray-600 break-words">{account.bio || "No bio available"}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs tabular-nums">
              <span>{formattedFollowers} Followers</span>
              <span>{account.following} Following</span>
            </div>
            {account.engagementRate && (
              <span className="text-xs text-gray-500 tabular-nums">{engagement} Engagement</span>
            )}
          </div>
        </div>
        <div className="w-20 text-center">
          <span className="font-semibold text-emerald-600 tabular-nums">{matchPercent} Match</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        {account.matchReasons.map((reason, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="text-emerald-600">✓</span> {reason}
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-3">
        <a
          href={account.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-3 rounded-md text-sm text-emerald-600 hover:bg-emerald-50 text-center focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          View Instagram
        </a>
        {onSave && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSave(account); }}
            className="py-2 px-3 rounded-md text-sm border border-gray-200 hover:bg-gray-50 focus-visible:ring-2"
            aria-label={`Save ${account.username}`}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};
