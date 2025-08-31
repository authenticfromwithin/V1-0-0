import React from "react"

type Props = { children: React.ReactNode }
type State = { hasError: boolean }

export default class ErrorBoundary extends React.Component<Props, State>{
  state: State = { hasError: false }
  static getDerivedStateFromError(){ return { hasError: true } }
  componentDidCatch(err: any, info: any){
    if (import.meta.env.DEV){
      // Log to non-visual overlay hook if you have it; fall back to console in dev
      console.error('[AFW:ErrorBoundary]', err, info)
    }
  }
  render(){
    if (this.state.hasError){
      return null
    }
    return this.props.children
  }
}
