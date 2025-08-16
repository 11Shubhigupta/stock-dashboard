import React from 'react'

export default function IndicatorToggles({
  showSMA20, setShowSMA20,
  showSMA50, setShowSMA50,
  showRSI, setShowRSI,
  showVolume, setShowVolume
}) {
  const Toggle = ({ label, checked, onChange }) => (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  )

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <span className="toolbar-title">Indicators</span>
        <Toggle label="SMA 20" checked={showSMA20} onChange={setShowSMA20}/>
        <Toggle label="SMA 50" checked={showSMA50} onChange={setShowSMA50}/>
        <Toggle label="RSI 14" checked={showRSI} onChange={setShowRSI}/>
        <Toggle label="Volume" checked={showVolume} onChange={setShowVolume}/>
      </div>
    </div>
  )
}
