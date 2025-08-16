// Simple least squares linear regression y ~ a + b x
export function linearRegressionYNext(y) {
  if (!y || y.length < 2) return null
  const n = y.length
  const xs = Array.from({ length: n }, (_, i) => i + 1)
  const sumX = xs.reduce((a,b)=>a+b,0)
  const sumY = y.reduce((a,b)=>a+b,0)
  const sumXY = xs.reduce((a, x, i)=>a + x * y[i], 0)
  const sumXX = xs.reduce((a, x)=>a + x*x, 0)
  const denom = n*sumXX - sumX*sumX
  if (denom === 0) return null
  const b = (n*sumXY - sumX*sumY) / denom
  const a = (sumY - b*sumX) / n
  const xNext = n + 1
  return a + b * xNext
}
