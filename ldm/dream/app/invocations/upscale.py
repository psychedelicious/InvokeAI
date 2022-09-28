# Copyright (c) 2022 Kyle Schouviller (https://github.com/kyle0654)

from datetime import datetime, timezone
from typing import Literal, Union
from pydantic import Field
from .image import BaseImageOutput, ImageField
from .baseinvocation import BaseInvocation
from ..services.invocation_services import InvocationServices


class UpscaleInvocation(BaseInvocation):
    """Upscales an image."""
    type: Literal["upscale"]

    # Inputs
    image: Union[ImageField,None] = Field(description="The input image", ui={"requires_connection": True})
    strength: float               = Field(default=0.75, gt=0, le=1, description="The strength")
    level: Literal[2,4]           = Field(default=2, description = "The upscale level")

    class Outputs(BaseImageOutput):
        ...

    def invoke(self, services: InvocationServices, context_id: str) -> Outputs: 
        results = services.generate.upscale_and_reconstruct(
            image_list     = [[self.image.get(), 0]],
            upscale        = (self.level, self.strength),
            strength       = 0.0, # GFPGAN strength
            save_original  = False,
            image_callback = None,
        )

        # Results are image and seed, unwrap for now
        # TODO: can this return multiple results?
        uri = f'results/{context_id}_{self.id}_{str(int(datetime.now(timezone.utc).timestamp()))}.png'
        services.images.save(uri, results[0][0])
        return UpscaleInvocation.Outputs.construct(
            image = ImageField.construct(uri = uri)
        )
