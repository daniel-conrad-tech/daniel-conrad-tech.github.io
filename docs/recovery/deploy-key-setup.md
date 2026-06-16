---
title: "Deploy Key Setup and Recovery"
status: active
date: 2026-06-16
---

# Deploy Key Setup and Recovery

This document describes how to configure a repository-scoped deploy key for
Codex so pushes can work for this repository without granting broader GitHub
access.

## Goal

- Allow Codex to push only to this repository.
- Avoid dependence on a personal SSH key.
- Keep the setup reproducible if the machine or SSH configuration changes.

## Important Rule

The deploy key must not use a passphrase.

Reason:

- Codex cannot interactively unlock a passphrase-protected SSH key.
- A passphrase-protected key prevents autonomous `git push`.
- We already confirmed this failure mode during setup: the SSH configuration was
  correct, but push access still failed when the key required manual unlock.

## Repository Scope

This setup is intended for:

- Repository: `daniel-conrad-tech/daniel-conrad-tech.github.io`

Deploy keys are repository-specific. A separate repository should get its own
separate deploy key.

## Setup Steps

1. Generate a new repo-specific SSH key without a passphrase.

```bash
ssh-keygen -t ed25519 -C "codex-deploy-daniel-conrad-tech.github.io" -f ~/.ssh/daniel-conrad-tech.github.io_deploy -N ""
```

2. Print the public key.

```bash
cat ~/.ssh/daniel-conrad-tech.github.io_deploy.pub
```

3. Add the public key in GitHub.

GitHub path:

- `Repository -> Settings -> Deploy keys -> Add deploy key`

Required settings:

- Title: `Codex Deploy Key`
- Paste the public key
- Enable `Allow write access`

4. Add an SSH host alias in `~/.ssh/config`.

```sshconfig
Host GitHub-daniel-conrad-tech-pages-deploy
  HostName github.com
  User git
  IdentityFile ~/.ssh/daniel-conrad-tech.github.io_deploy
  IdentitiesOnly yes
```

The same snippet is stored in:

- `docs/recovery/github-deploy-key.ssh-config`

5. Point the repository remote at that host alias.

```bash
git remote set-url origin git@GitHub-daniel-conrad-tech-pages-deploy:daniel-conrad-tech/daniel-conrad-tech.github.io.git
```

These local setup steps can also be prepared with:

```bash
bash scripts/setup-deploy-remote.sh
```

What the script does:

- checks that the deploy key files exist
- prints the public key so it can be pasted into GitHub
- writes or refreshes the managed SSH config block in `~/.ssh/config`
- points `origin` at the deploy-key host alias
- runs an SSH authentication test

What the script does not do:

- it does not create the deploy key in GitHub automatically
- it does not bypass the need to confirm the deploy key in the GitHub UI

6. Test SSH access.

```bash
ssh -T GitHub-daniel-conrad-tech-pages-deploy
```

7. Test push access.

```bash
git push origin main
```

## Verification Checklist

- `git remote -v` uses the deploy-key host alias.
- `~/.ssh/config` points that alias to the repo-specific key.
- The private key file exists locally.
- The public key is registered in GitHub as a deploy key for this repository.
- `Allow write access` is enabled.
- The key has no passphrase.

## Recovery

If push fails, check these in order:

1. Confirm the remote URL.

```bash
git remote -v
```

2. Confirm the SSH alias exists.

```bash
sed -n '1,240p' ~/.ssh/config
```

3. Confirm the key files exist.

```bash
ls -la ~/.ssh
```

4. Confirm GitHub accepts the key.

```bash
ssh -T GitHub-daniel-conrad-tech-pages-deploy
```

5. If GitHub returns `Permission denied (publickey)`, verify:

- the public key was copied correctly
- the key was added to the correct repository
- write access was enabled
- the remote uses the correct host alias

6. If the key has a passphrase, replace it with a new deploy key that does not
   use one.

## Notes

- This key should be used only for this repository.
- This setup is intentionally narrower than a personal GitHub SSH key.
- If deployment or host setup changes later, update this document at the same
  time.
- Repo-local helper artifacts:
- `docs/recovery/github-deploy-key.ssh-config`
- `scripts/setup-deploy-remote.sh`
