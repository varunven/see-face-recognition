closing_prices = [169.36, 168.31, 167.22, 165.56, 173.33, 173.26, 171.53, 173.32, 173.51, 172.57, 172.07, 172.07, 172.69, 175.05, 175.16]
daily_returns = [(closing_prices[i] - closing_prices[i-1]) / closing_prices[i-1] for i in range(1, len(closing_prices))]
average_return = sum(daily_returns) / len(daily_returns)
variance = sum((n - average_return) ** 2 for n in daily_returns) / len(daily_returns)
standard_deviation = variance ** 0.5
coefficient_of_variation = standard_deviation / average_return

print(closing_prices, daily_returns, average_return, variance, standard_deviation, coefficient_of_variation)




