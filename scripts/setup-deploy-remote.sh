#!/usr/bin/env bash

set -euo pipefail

remote_host="GitHub-daniel-conrad-tech-pages-deploy"
remote_repo="daniel-conrad-tech/daniel-conrad-tech.github.io.git"
remote_url="git@${remote_host}:${remote_repo}"
key_path="${HOME}/.ssh/daniel-conrad-tech.github.io_deploy"
config_snippet="docs/recovery/github-deploy-key.ssh-config"
ssh_config="${HOME}/.ssh/config"
config_begin="# BEGIN codex deploy key: daniel-conrad-tech.github.io"
config_end="# END codex deploy key: daniel-conrad-tech.github.io"

ensure_ssh_config_entry() {
  local tmp_file

  mkdir -p "${HOME}/.ssh"
  touch "${ssh_config}"
  chmod 600 "${ssh_config}"

  tmp_file="$(mktemp)"

  awk -v begin="${config_begin}" -v end="${config_end}" '
    $0 == begin { skip=1; next }
    $0 == end { skip=0; next }
    skip != 1 { print }
  ' "${ssh_config}" > "${tmp_file}"

  mv "${tmp_file}" "${ssh_config}"

  {
    printf "\n%s\n" "${config_begin}"
    cat "${config_snippet}"
    printf "%s\n" "${config_end}"
  } >> "${ssh_config}"
}

echo
echo "Checking expected key files..."
if [[ -f "${key_path}" && -f "${key_path}.pub" ]]; then
  ls -l "${key_path}" "${key_path}.pub"
else
  echo "Missing deploy key files at ${key_path}(.pub)" >&2
  echo "Generate the key first. See ${config_snippet}" >&2
  exit 1
fi

echo
echo "Public key for GitHub deploy key setup:"
cat "${key_path}.pub"

echo
echo "Writing SSH config entry to ${ssh_config}..."
ensure_ssh_config_entry

echo
echo "Managed SSH config block:"
sed -n "/${config_begin}/,/${config_end}/p" "${ssh_config}"

echo
echo "Configuring origin to use deploy-key host alias..."
git remote set-url origin "${remote_url}"

echo
echo "Current git remote:"
git remote -v

echo
echo "Testing SSH authentication..."
ssh -T "${remote_host}" || true

echo
echo "Setup check complete."
