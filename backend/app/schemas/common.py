from typing import Dict, Optional, Union
from pydantic import BaseModel

# A simple type alias doesn't work well with Pydantic models directly as a field type without a wrapper
# But we can use Dict[str, str] for now.
