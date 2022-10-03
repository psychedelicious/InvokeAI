# Copyright (c) 2022 Kyle Schouviller (https://github.com/kyle0654)

from datetime import datetime, timezone
from typing import Any, Literal, Optional, Union
import numpy as np
from pydantic import Field

from .image import ImageField, ImageOutput
from .baseinvocation import BaseInvocation
from ..services.image_storage import ImageType
from ..services.invocation_services import InvocationServices


SAMPLER_NAME_VALUES = Literal["ddim","plms","k_lms","k_dpm_2","k_dpm_2_a","k_euler","k_euler_a","k_heun"]

# Text to image
class TextToImageInvocation(BaseInvocation):
    """Generates an image using text2img."""
    type: Literal['txt2img'] = 'txt2img'

    # Inputs
    # TODO: consider making prompt optional to enable providing prompt through a link
    # prompt: Optional[str]     = Field(description="The prompt to generate an image from")
    # seed: int                 = Field(default=0, ge=0, le=np.iinfo(np.uint32).max, description="The seed to use (0 for a random seed)")
    # steps: int                = Field(default=10, gt=0, description="The number of steps to use to generate the image")
    # width: int                = Field(default=512, multiple_of=64, gt=0, description="The width of the resulting image")
    # height: int               = Field(default=512, multiple_of=64, gt=0, description="The height of the resulting image")
    # cfg_scale: float          = Field(default=7.5, gt=0, description="The Classifier-Free Guidance, higher values may result in a result closer to the prompt")
    # sampler_name: SAMPLER_NAME_VALUES = Field(default="k_lms", description="The sampler to use")
    # seamless: bool            = Field(default=False, description="Whether or not to generate an image that can tile without seams")
    # model: str                = Field(default='', description="The model to use (currently ignored)")
    # progress_images: bool     = Field(default=False, description="Whether or not to produce progress images during generation")
    prompt: Optional[str]     = Field(description="The prompt to generate an image from", ui={"requires_connection": True})
    seed: int                 = Field(default=0, ge=0, le=np.iinfo(np.uint32).max, description="The seed to use (0 for a random seed)", ui={"type":"number_input", "with_randomize_icon_button": True})
    steps: int                = Field(default=10, gt=0, description="The number of steps to use to generate the image", ui={"type": "slider", "slider_max": 100, "with_number_input": True})
    width: int                = Field(default=512, gt=0, le=4096, multiple_of=64, description="The width of the resulting image", ui={"type": "slider", "slider_max": 1024, "with_number_input": True})
    height: int               = Field(default=512, gt=0, le=4096, multiple_of=64, description="The height of the resulting image", ui={"type": "slider", "slider_max": 1024, "with_number_input": True})
    cfg_scale: float          = Field(default=7.5, gt=0, le=20, description="The Classifier-Free Guidance, higher values may result in a result closer to the prompt", ui={"label": "CFG scale", "with_number_input": True})
    sampler_name: SAMPLER_NAME_VALUES = Field(default="k_lms", description="The sampler to use", ui={"label": "Sampler"})
    seamless: bool            = Field(default=False, description="Whether or not to generate an image that can tile without seams")
    model: str                = Field(default='', description="The model to use (currently ignored)")
    progress_images: bool     = Field(default=False, description="Whether or not to produce progress images during generation")

    class Config:
        schema_extra = {
            'ui': {
                'label': 'Text to Image'
            }
        }
    # TODO: pass this an emitter method or something? or a session for dispatching?
    def dispatch_progress(self, services: InvocationServices, session_id: str, sample: Any = None, step: int = 0) -> None:
        services.events.emit_generator_progress(
            session_id, self.id, step, float(step) / float(self.steps)
        )

    def invoke(self, services: InvocationServices, session_id: str) -> ImageOutput:

        def step_callback(sample, step = 0):
            self.dispatch_progress(services, session_id, sample, step)

        results = services.generate.prompt2image(
            prompt = self.prompt,
            step_callback = step_callback,
            **self.dict(exclude = {'prompt'}) # Shorthand for passing all of the parameters above manually
        )

        # Results are image and seed, unwrap for now and ignore the seed
        # TODO: pre-seed?
        # TODO: can this return multiple results? Should it?
        image_type = ImageType.RESULT
        image_name = f'{session_id}_{self.id}_{str(int(datetime.now(timezone.utc).timestamp()))}.png'
        services.images.save(image_type, image_name, results[0][0])
        return ImageOutput(
            image = ImageField(image_type = image_type, image_name = image_name)
        )

class ImageToImageInvocation(TextToImageInvocation):
    """Generates an image using img2img."""
    type: Literal['img2img'] = 'img2img'

    # Inputs
    image: Union[ImageField,None] = Field(description="The input image")
    strength: float               = Field(default=0.75, gt=0, le=1, description="The strength of the original image")
    fit: bool                     = Field(default=True, description="Whether or not the result should be fit to the aspect ratio of the input image")

    def invoke(self, services: InvocationServices, session_id: str) -> ImageOutput:
        results = services.generate.prompt2image(
            prompt   = self.prompt,
            init_img = self.image.get(),
            **self.dict(exclude = {'prompt','image'}) # Shorthand for passing all of the parameters above manually
        )

        # TODO: send events on progress

        # Results are image and seed, unwrap for now and ignore the seed
        # TODO: pre-seed?
        # TODO: can this return multiple results? Should it?
        image_type = ImageType.RESULT
        image_name = f'{session_id}_{self.id}_{str(int(datetime.now(timezone.utc).timestamp()))}.png'
        services.images.save(image_type, image_name, results[0][0])
        return ImageOutput(
            image = ImageField(image_type = image_type, image_name = image_name)
        )
