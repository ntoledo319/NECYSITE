---
description: Run a security review using the senior-security skill. Performs threat modeling (STRIDE), secret scanning, secure code review, and vulnerability assessment per OWASP guidelines.
---

# Security Review Workflow

This workflow uses the `senior-security` skill from `claude-skills/engineering-team/senior-security/`.

## Step 1: Secret Scanning

Scan for hardcoded secrets and credentials:
// turbo

```bash
python3 claude-skills/engineering-team/senior-security/scripts/secret_scanner.py .
```

## Step 2: Threat Modeling (STRIDE)

Run STRIDE threat analysis with DREAD risk scoring:

```bash
python3 claude-skills/engineering-team/senior-security/scripts/threat_modeler.py .
```

## Step 3: Secure Code Review Checklist

Review these categories per the Security Code Review Checklist:

- [ ] **Input Validation**: All user input validated and sanitized (Risk: Injection)
- [ ] **Output Encoding**: Context-appropriate encoding applied (Risk: XSS)
- [ ] **Authentication**: Passwords hashed with Argon2/bcrypt (Risk: Credential theft)
- [ ] **Session**: Secure cookie flags set — HttpOnly, Secure, SameSite (Risk: Session hijacking)
- [ ] **Authorization**: Server-side permission checks on all endpoints (Risk: Privilege escalation)
- [ ] **SQL**: Parameterized queries used exclusively (Risk: SQL injection)
- [ ] **File Access**: Path traversal sequences rejected (Risk: Path traversal)
- [ ] **Secrets**: No hardcoded credentials or keys (Risk: Information disclosure)
- [ ] **Dependencies**: Known vulnerable packages updated (Risk: Supply chain)
- [ ] **Logging**: Sensitive data not logged (Risk: Information disclosure)

## Step 4: Security Headers Check

Verify these headers are configured:

| Header                    | Recommended Value                        |
| ------------------------- | ---------------------------------------- |
| Content-Security-Policy   | default-src 'self'; script-src 'self'    |
| X-Frame-Options           | DENY                                     |
| X-Content-Type-Options    | nosniff                                  |
| Strict-Transport-Security | max-age=31536000; includeSubDomains      |
| Referrer-Policy           | strict-origin-when-cross-origin          |
| Permissions-Policy        | geolocation=(), microphone=(), camera=() |

## Step 5: Document Findings

Classify findings by severity:

- **Critical**: Immediate exploitation risk
- **High**: Significant impact, easier to exploit
- **Medium**: Moderate impact or difficulty
- **Low**: Minor impact
