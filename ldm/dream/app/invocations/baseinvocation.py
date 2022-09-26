# Copyright (c) 2022 Kyle Schouviller (https://github.com/kyle0654)

from abc import ABC, abstractmethod
from typing import get_args, get_type_hints
from pydantic import BaseModel, Field
from ..services.invocation_services import InvocationServices


class BaseInvocationOutput(BaseModel):
    """Base class for all invocation outputs"""
    ...


class BaseInvocation(ABC, BaseModel):
    """A node to process inputs and produce outputs.
    May use dependency injection in __init__ to receive providers.
    """
    @classmethod
    def get_all_subclasses(cls):
        subclasses = []
        toprocess = [cls]
        while len(toprocess) > 0:
            next = toprocess.pop(0)
            next_subclasses = next.__subclasses__()
            subclasses.extend(next_subclasses)
            toprocess.extend(next_subclasses)
        return subclasses

    @classmethod
    def get_invocations(cls):
        return tuple(BaseInvocation.get_all_subclasses())

    @classmethod
    def get_invocations_map(cls):
        # Get the type strings out of the literals and into a dictionary
        return dict(map(lambda t: (get_args(get_type_hints(t)['type'])[0], t),BaseInvocation.get_all_subclasses()))
        
    @abstractmethod
    def invoke(self, services: InvocationServices) -> BaseInvocationOutput:
        """Invoke with provided services and return outputs."""
        pass

    id: str = Field(description="The id of this node. Must be unique among all nodes.")
