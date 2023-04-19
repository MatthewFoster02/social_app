from io import BytesIO
from decouple import config
from PIL import Image
import cloudinary
import cloudinary.uploader

CLOUD_NAME = config("CLOUDINARY_NAME", cast=str)
API_KEY = config("CLOUDINARY_KEY", cast=str)
API_SECRET = config("CLOUDINARY_SECRET", cast=str)

cloudinary.config(
    cloud_name = CLOUD_NAME,
    api_key = API_KEY,
    api_secret = API_SECRET
)

async def resize_image(image):
    with Image.open(image.file) as img:
        width, height = img.size
        scale_factor = max(400 / width, 400 / height)
        new_width = int(width * scale_factor)
        new_height = int(height * scale_factor)
        resized_image = img.resize((new_width, new_height))

        left = (new_width - 400) // 2
        top = (new_height - 400) // 2
        right = left + 400
        bottom = top + 400
        cropped_image = resized_image.crop((left, top, right, bottom))

        out_image = BytesIO()
        cropped_image.save(out_image, 'JPEG')
        out_image.seek(0)

        result = cloudinary.uploader.upload(
            out_image,
            folder='profile_pics'
        )

        return result.get('url')
