""" Define the endpoints for searching. """

import json

import fastapi
import requests
import sqlalchemy.orm
from starlette import responses

import config
import schemas.search
import models.search

router = fastapi.APIRouter()


# TODO: read the ims-api endpoint from an environment variable.
@router.get("/search")
async def search(serial: str, response: responses.Response):
    """
    Find financial statements that match the search criteria.

        Parameters:
            serial: The serial number to search for.
    """
    ims_response = requests.get(config.IMS_API_URL + "/search?serial={}".format(serial))

    response.status_code = ims_response.status_code

    return json.loads(ims_response.content.decode("utf-8"))


@router.get("/searches/{search_id}", response_model=schemas.search.Search, response_model_by_alias=False)
def read_search(search_id: int, session: sqlalchemy.orm.Session = fastapi.Depends(models.database.get_session)):
    """
    Get the details for a previously submitted search request

        Parameters:
            search_id: The identifier of the search instance to lookup
        Returns:
            schemas.search.Search
    """
    search_db_row = models.search.Search.get_search(session, search_id)
    if search_db_row is None:
        raise fastapi.HTTPException(status_code=404, detail="Search record not found")
    return search_db_row
