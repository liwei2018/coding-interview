import sys

def solve():
    try:
        line1 = sys.stdin.readline()
        if not line1:
            return
        t = int(line1.strip())
        
        for _ in range(t):
            line = sys.stdin.readline().split()
            if not line:
                break
            x, n = map(int, line)
            
            if n % 2 == 0:
                print(0)
            else:
                print(x)
    except ValueError:
        pass

if __name__ == "__main__":
    solve()