from flask import Flask, render_template, Response, jsonify, request, session, flash
import os
from model import process_image
import json 
from flask_mail import Mail, Message
from config import mail_username, mail_password


#app configs
app = Flask(__name__)   
app.config['SECRET_KEY'] = os.urandom(24)
app.config['UPLOAD_FOLDER'] = 'static/assets/files'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = mail_username
app.config['MAIL_PASSWORD'] = mail_password

#model paths
MODEL_AUG_PATH = 'medetect_withaugment.pt'
MODEL_NO_AUG_PATH = 'medetect_withoutaugment.pt'

#mail
mail = Mail(app)

#index route
@app.route("/")
@app.route("/home")
def index():
    return render_template('index.jinja');

#api endpoint
@app.route("/upload", methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # gets augmentation status from the form
        augmented = request.form.get('data-augmentation')

        # check if the post request has the file part
        if 'image' not in request.files:
            return {'message': 'No file uploaded.', 'success': False}

        file = request.files['image']

        # if user does not select file
        if file.filename == '':
            return {'message': 'No file selected.', 'success': False}

        # if file exists
        if file:
            #set mode for model
            if augmented:
                mode = MODEL_AUG_PATH
            else:
                mode = MODEL_NO_AUG_PATH

            result, file_path = process_image(mode, file, app.config['UPLOAD_FOLDER'])
            
            if result:
                # Object detected
                return jsonify({'message': 'Success', 'success': result, 'file_path': file_path})
            else:
                # No object detected
                return jsonify({'message': 'No object detected', 'success': result, 'file_path': file_path})


#contact form submission
@app.route("/contact-form", methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')

        msg = Message(subject=f"Mail from {name}", body=f"Name: {name}\nEmail: {email}\n\n{message}", 
                      sender = mail_username, recipients = ['MEDetect2023@gmail.com'])
        mail.send(msg)
        
        return render_template('index.jinja', success = True)
         
    return render_template('index.jinja')