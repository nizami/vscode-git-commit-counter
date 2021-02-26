# Git commit counter

[![GitHub Repo stars](https://img.shields.io/github/stars/nizami/vscode-git-commit-counter?style=social)](https://github.com/nizami/vscode-git-commit-counter)
[![Visual Studio Marketplace](https://vsmarketplacebadge.apphb.com/version/nizami.git-commit-counter.svg)](https://marketplace.visualstudio.com/items?itemName=nizami.git-commit-counter)

Shows how many git commit were in the day in status bar

![Status bar icon](https://github.com/nizami/vscode-git-commit-counter/raw/master/status-bar.png)

Also you can choose what counter will be shown.
![Information popup](https://github.com/nizami/vscode-git-commit-counter/raw/master/select-counter.png)

Or add your custom time range in the workspace or user `settings.json`:

```json
{
    "gitCommitCounter.since": "yesterday midnight",
    "gitCommitCounter.until": "midnight"
}
```

Use the following git time patterns:

`yesterday, noon, midnight, tea, never, now`

Or set exact time: `2PM, 6AM`

Git time documentation:
<https://github.com/git/git/blob/master/date.c#L1138>
