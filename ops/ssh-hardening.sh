#!/usr/bin/env bash
set -euo pipefail

install -d -m 755 /etc/ssh/sshd_config.d
cp /etc/ssh/sshd_config "/etc/ssh/sshd_config.bak.ai-manager-$(date +%Y%m%d%H%M%S)"

cat > /etc/ssh/sshd_config.d/90-ai-manager-hardening.conf <<'EOF'
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
PermitRootLogin no
PermitEmptyPasswords no
AuthenticationMethods publickey
MaxAuthTries 3
X11Forwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
EOF

sshd -t
systemctl reload ssh

if [ -f /etc/ssh/sshd_config.d/50-cloud-init.conf ]; then
  cp /etc/ssh/sshd_config.d/50-cloud-init.conf \
    "/etc/ssh/sshd_config.d/50-cloud-init.conf.bak.ai-manager-$(date +%Y%m%d%H%M%S)"
  printf '%s\n' 'PasswordAuthentication no' > /etc/ssh/sshd_config.d/50-cloud-init.conf
fi

sshd -t
systemctl reload ssh

passwd -l root
passwd -S root

sshd -T | grep -E '^(permitrootlogin|passwordauthentication|kbdinteractiveauthentication|pubkeyauthentication|authenticationmethods|maxauthtries|x11forwarding) '
echo SSH_HARDENING_DONE
