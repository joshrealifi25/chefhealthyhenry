import Anthropic from "@anthropic-ai/sdk";
import { identityTokenFromValue } from "@anthropic-ai/sdk/lib/credentials/identity-token";
import { oidcFederationProvider } from "@anthropic-ai/sdk/lib/credentials/oidc-federation";

/**
 * Sous talks to Anthropic as the Vercel workload when federation is configured.
 * A leftover API key must not win, or requests stay on the old empty account.
 */
export function sousAnthropic(identityToken: string | null): Anthropic | null {
  const ruleId = process.env.ANTHROPIC_FEDERATION_RULE_ID;
  const organizationId = process.env.ANTHROPIC_ORGANIZATION_ID;
  const serviceAccountId = process.env.ANTHROPIC_SERVICE_ACCOUNT_ID;
  const workspaceId = process.env.ANTHROPIC_WORKSPACE_ID;

  if (ruleId && organizationId && serviceAccountId && identityToken) {
    return new Anthropic({
      apiKey: null,
      credentials: oidcFederationProvider({
        identityTokenProvider: identityTokenFromValue(identityToken),
        federationRuleId: ruleId,
        organizationId,
        serviceAccountId,
        ...(workspaceId ? { workspaceId } : {}),
        baseURL: "https://api.anthropic.com",
        fetch,
      }),
    });
  }

  if (process.env.ANTHROPIC_API_KEY) return new Anthropic();
  return null;
}
