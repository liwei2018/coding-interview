import sys
import math

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    t = int(input_data[0])
    results = []
    
    for i in range(1, t + 1):
        n = int(input_data[i])
        
        if n % 2 != 0 or n < 4:
            results.append("-1")
        else:
            max_crafts = n // 4
            
            min_crafts = (n + 5) // 6
            
            results.append(f"{min_crafts} {max_crafts}")
    
    print("\n".join(results))

if __name__ == "__main__":
    solve()