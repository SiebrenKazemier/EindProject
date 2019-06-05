from flask import Flask, render_template
app = Flask(__name__)

# # Ensure templates are auto-reloaded
# app.config["TEMPLATES_AUTO_RELOAD"] = True
#
# # Custom filter
# app.jinja_env.filters["usd"] = usd
#
# # Configure session to use filesystem (instead of signed cookies)
# app.config["SESSION_FILE_DIR"] = mkdtemp()
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_TYPE"] = "filesystem"
# Session(app)


@app.route("/")
def index():
    return render_template("jinja.html")


if __name__ == '__main__':
    app.run(debug=True)
