// Build-time flag for air-gapped deployments. Set NEXT_PUBLIC_AIRGAP=1 to
// produce a static export with no CDN dependencies, no Analytics, and the
// LLM-backed tools hidden from nav. See AIRGAP.md for the full walkthrough.
export const AIRGAP = process.env.NEXT_PUBLIC_AIRGAP === '1'
