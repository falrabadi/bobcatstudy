import schedule
import time

def showUnavailable(status):
    a = 'Available'
    b = 'Unavailable'
    status.replace(a, b)

    schedule.every(4).seconds.do(showUnavailable)

    while 1:
        schedule.run_pending()
        time.sleep(1)
