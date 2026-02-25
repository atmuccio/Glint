# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 0.x     | :white_check_mark: |

## Reporting a Vulnerability

**Please do not open public issues for security vulnerabilities.**

Instead, use [GitHub Security Advisories](https://github.com/atmuccio/Glint/security/advisories/new) to report vulnerabilities privately. This ensures the issue can be assessed and addressed before public disclosure.

### What to include in your report

- A description of the vulnerability
- Steps to reproduce the issue
- The potential impact
- Any suggested fixes (optional)

### Response Timeline

- **Acknowledgment**: Within 48 hours of receiving the report
- **Assessment**: Within 1 week, we will confirm whether the report is valid and its severity
- **Resolution**: Depends on severity:
  - **Critical**: Patch release within 1 week
  - **High**: Patch release within 2 weeks
  - **Medium/Low**: Included in the next scheduled release

### After Resolution

Once a fix is released, we will:
1. Publish a GitHub Security Advisory with full details
2. Credit the reporter (unless they prefer to remain anonymous)
3. Include the fix in the CHANGELOG

## Scope

As a UI component library, security issues in scope include:

- **XSS vulnerabilities** in component rendering or template handling
- **Dependency vulnerabilities** in production dependencies
- **Prototype pollution** or injection through component inputs
- **CSS injection** through theme customization APIs

Out of scope:
- Vulnerabilities in development-only dependencies
- Issues requiring physical access to the user's machine
- Social engineering attacks

## Contact

For security matters, you can also reach us at **atmuccio@users.noreply.github.com**.
