from ultralytics import YOLO
from werkzeug.utils import secure_filename
from PIL import Image, ImageDraw, ImageFont
import os


def process_image(mode, file, destination_folder):
    # Load model
    model = YOLO(mode)

    # Get file type
    file_type = file.filename.split(".")[-1]

    # Generate secure filename
    filename = secure_filename(str(os.urandom(24)) + "." + file_type)

    # Save uploaded file
    file.save(os.path.join(destination_folder, filename))

    # Predict objects
    results = model.predict(source=os.path.join(destination_folder, filename))
    result_image = results[0]

    if len(result_image) == 0:
        print("No object detected")

        # Open original image
        original_image = Image.open(os.path.join(destination_folder, filename))

        # Create drawing object
        draw = ImageDraw.Draw(original_image)

        # Customize text
        text = "No object detected"
        text_color = "white"
        background_color = "black"

        # Initialize font with default font family and size 16
        font = ImageFont.truetype("arial.ttf", 64)

        # Calculate text size and position
        text_width, text_height = draw.textsize(text, font=font)
        position = (
            (original_image.width - text_width) // 2,
            (original_image.height - text_height) // 2,
        )

        # Add background rectangle
        background_rectangle = [
            position[0] - 10,
            position[1] - 10,
            position[0] + text_width + 10,
            position[1] + text_height + 10,
        ]
        draw.rectangle(background_rectangle, fill=background_color)

        # Add text to the image
        draw.text(position, text, fill=text_color, font=font)

        # Construct output path
        file_path = os.path.join(destination_folder + "/outputs/", filename)

        # Save processed image
        original_image.save(file_path)

        # Return path
        return False, file_path


    else:
        # Plot detected objects and convert to PIL image
        output_array = result_image.plot()
        output_array = output_array / output_array.max()
        output_array = (output_array * 255).astype("uint8")
        output_array = output_array[:, :, ::-1]
        output_image = Image.fromarray(output_array)

        # Construct output path
        file_path = os.path.join(destination_folder + "/outputs/", filename)

        # Save processed image
        output_image.save(file_path)

        # Return path
        return True, file_path