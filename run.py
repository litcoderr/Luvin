from app import app
import app.config as config

if __name__ == "__main__":
    app.debug = config.DEBUG
    app.run()
