import { execSync } from 'child_process';
import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
  const commandId = 'sample.showAdditionalInfo';
  subscriptions.push(
    vscode.commands.registerCommand(commandId, () => {
      vscode.window.showInformationMessage(
        `Today - ${getGitCommitsCount('midnight')},` +
          `Yesterday - ${getGitCommitsCount('yesterday midnight', 'midnight')}`
      );
    })
  );
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.command = commandId;
  subscriptions.push(statusBarItem);

  const o = (): vscode.Disposable => {
    const id = setInterval(() => {
      updateStatusBarItem();
    }, 30_000);
    return {
      dispose() {
        clearInterval(id);
      },
    };
  };
  subscriptions.push(o());
  updateStatusBarItem();
}

function updateStatusBarItem(): void {
  statusBarItem.text = `$(github-alt) ${getGitCommitsCount('midnight')}`;
  statusBarItem.tooltip = 'Commits count';
  statusBarItem.show();
}

function getGitCommitsCount(since = '', until = '') {
  if (!vscode.workspace.workspaceFolders) return;
  since = since ? `--since="${since}"` : '';
  until = until ? `--until="${until}"` : '';
  const author = '--author=$(git config user.email)';
  const command = `git rev-list --count HEAD ${since} ${until} ${author}`;
  return execSync(command, {
    cwd: vscode.workspace.workspaceFolders[0].uri.path,
  })
    .toString()
    .trim();
}
