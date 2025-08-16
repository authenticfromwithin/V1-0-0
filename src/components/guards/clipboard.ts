// shim so imports like ../guards/clipboard keep working from components/journal/*
export * from '../../guards/clipboard';
// default passthrough (harmless if the target has no default)
import def from '../../guards/clipboard';
export default def;
