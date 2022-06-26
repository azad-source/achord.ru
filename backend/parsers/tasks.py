from celery import shared_task



@shared_task(ignore_result=True)
def parse_notes():
    print('==================test===========')
    print('==================test===========')
    print('==================test===========')
    print('==================test===========')
    print('==================test===========')
    print('==================test===========')