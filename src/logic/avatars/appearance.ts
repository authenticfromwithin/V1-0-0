export type AppearancePathOpts = {
  prefix: string
  arch?: string
  vari?: string
  stateName: string
  fmt: string
  file: string
}

/** Joins parts into "prefix[/arch][/vari]/stateName/fmt/file" */
export function composeAssetPath(opts: AppearancePathOpts): string {
  const { prefix, arch, vari, stateName, fmt, file } = opts
  const archSeg = arch ? `/${arch}` : ""
  const varSeg  = vari ? `/${vari}` : ""
  return `${prefix}${archSeg}${varSeg}/${stateName}/${fmt}/${file}`
}
