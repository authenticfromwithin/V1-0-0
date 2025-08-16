// shim: keep legacy import "../guards/clipboard" working from components/journal/*
export * from '../../guards/clipboard';
// optional default passthrough (harmless if no default)
// @ts-ignore
import def from '../../guards/clipboard';
// @ts-ignore
export default def;
