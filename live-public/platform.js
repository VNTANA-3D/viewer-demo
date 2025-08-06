export async function getPlatformData(organization, workspace, product) {
  const baseUrl = `https://api.vntana.com`;
  const productUrl = `${baseUrl}/products/${product}/organizations/${organization}/clients/${workspace}`

  const productData = await fetch(productUrl).then(response => response.json());

  if (productData.errors.length > 0) {
    throw new Error(productData.errors);
  }

  const models = productData.response.asset.models;
  const glbId = models.find(model => model.conversionFormat === "GLB")?.modelBlobId || "";
  const usdzId = models.find(model => model.conversionFormat === "USDZ")?.modelBlobId || "";

  const src = `${baseUrl}/assets/products/${product}/organizations/${organization}/clients/${workspace}/${glbId}`;
  const usdzSrc = `${baseUrl}/assets/products/${product}/organizations/${organization}/clients/${workspace}/${usdzId}`;
  const poster = `${baseUrl}/assets/thumbnail/products/${product}/organizations/${organization}/clients/${workspace}/`;
  const qrUrl = `https://embed.vntana.com?productUuid=${product}&clientSlug=${workspace}&organizationSlug=${organization}&autoAR=true`;

  return {
    src,
    usdzSrc,
    poster,
    qrUrl,
    config: JSON.parse(productData.response.viewerSettings.config),
  };
}
