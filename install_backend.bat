python -m venv venv
venv\Scripts\python.exe -m pip install -r requirements.txt
venv\Scripts\python.exe backend\manage.py makemigrations
venv\Scripts\python.exe backend\manage.py migrate
