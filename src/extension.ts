import { execSync } from 'child_process';
import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
  const commandId = 'sample.showAdditionalInfo';

  // vscode.workspace.onDidChangeConfiguration(onDidChangeConfiguration);

  subscriptions.push(
    vscode.commands.registerCommand(commandId, async () => {
      updateStatusBarItem();

      const today = getGitCommitsCount('midnight');
      const yesterday = getGitCommitsCount('yesterday midnight', 'midnight');
      const result = await vscode.window.showInformationMessage(
        `Select git commit counter`,
        `Today ${today}`,
        `Yesterday ${yesterday}`
      );
      if (!result) return;
      if (result.startsWith('Today')) {
        await config().update('since', 'midnight');
        await config().update('until', undefined);
      } else if (result.startsWith('Yesterday')) {
        await config().update('since', 'yesterday midnight');
        await config().update('until', 'midnight');
      }
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
  let since = config().get<string>('since') || 'midnight';
  let until = config().get<string>('until') || '';

  const count = getGitCommitsCount(since, until);
  if (count === undefined) {
    statusBarItem.hide();
    return;
  }
  statusBarItem.text = `$(github-alt) ${count}`;
  statusBarItem.tooltip = Object.entries({ since, until })
    .filter(([k, v]) => v)
    .map(([k, v]) => k + ' ' + v)
    .join(', ');
  statusBarItem.show();
}

function getGitCommitsCount(since = '', until = '') {
  if (!vscode.workspace.workspaceFolders) return;

  try {
    since = since ? `--since="${since}"` : '';
    until = until ? `--until="${until}"` : '';
    const author = '--author=$(git config user.email)';
    const command = `git rev-list --count HEAD ${since} ${until} ${author}`;
    return execSync(command, {
      cwd: vscode.workspace.workspaceFolders[0].uri.path,
    })
      .toString()
      .trim();
  } catch (error) {
    console.log(error);
  }
}

// function onDidChangeConfiguration() {
//   vscode.workspace.onDidChangeConfiguration((e) => {
//     const value: any = config().get('since');
//     console.log(value);
//   });
// }

function config() {
  return vscode.workspace.getConfiguration('gitCommitCounter');
}
