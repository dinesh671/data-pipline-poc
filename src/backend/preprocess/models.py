from pydantic import BaseModel, Field, field_validator
from typing import Optional

class UploadRequest(BaseModel):
    filename: str
    content_type: str
    file_size: int = Field(gt=0, le=10 * 1024 * 1024)

    @field_validator('content_type')
    @classmethod
    def validate_type(cls, v):
        if v not in ['text/csv','text/tsv','text/xls' 'application/json']:
            raise ValueError("please upload a valid file")
        return v

class SupplyChainRecord(BaseModel):
    Product_type: str = Field(alias="Product type")
    SKU: str
    Price: float
    Availability: int
    Number_of_products_sold: int = Field(alias="Number of products sold")
    Revenue_generated: float = Field(alias="Revenue generated")
    Stock_level: int = Field(alias="Stock level")
    Shipping_costs: float = Field(alias="Shipping costs")
    Defect_rate: float = Field(alias="Defect rate")
    Inspection_results: str = Field(alias="Inspection results")

    # Example of a "Senior" level validation
    @field_validator('Defect_rate')
    @classmethod
    def check_defect_rate(cls, v):
        if v < 0 or v > 100:
            raise ValueError('Defect rate must be between 0 and 100')
        return v