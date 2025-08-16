// shim: keep legacy import "../guards/clipboard" working from components/journal/*
export * from '../../guards/clipboard';
// preserve default export too, if the module has one
// (harmless if it doesn't)
// @ts-ignore
import def from '../../guards/clipboard';
// @ts-ignore
export default def;
