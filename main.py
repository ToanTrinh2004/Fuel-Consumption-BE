import os
import sys

from core import check_connection, create_app

app = create_app()

if __name__ == '__main__':
    if not check_connection(app):
        print('Could not connect to the database. Server shutting down.')
        sys.exit(1)
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
