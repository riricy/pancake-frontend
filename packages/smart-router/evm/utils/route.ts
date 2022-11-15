import { Currency, Price } from '@pancakeswap/sdk'

import { RouteWithStableSwap } from '../types'

export function getMidPrice<TIn extends Currency, TOut extends Currency>(
  route: RouteWithStableSwap<TIn, TOut>,
): Price<TIn, TOut> {
  // TODO caching
  const prices: Price<Currency, Currency>[] = []
  for (const [i, pair] of route.pairs.entries()) {
    prices.push(
      route.path[i].equals(pair.token0)
        ? new Price(pair.reserve0.currency, pair.reserve1.currency, pair.reserve0.quotient, pair.reserve1.quotient)
        : new Price(pair.reserve1.currency, pair.reserve0.currency, pair.reserve1.quotient, pair.reserve0.quotient),
    )
  }
  const reduced = prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0])
  return new Price(route.input, route.output, reduced.denominator, reduced.numerator)
}
