import axios from 'axios';

export const fetchSchoolInfo = async (schoolName) => 
{
  const API_URL = `https://open.neis.go.kr/hub/schoolInfo`;
  const API_KEY = process.env.REACT_APP_FETCH_NEIS_KEY;

  const params = 
  {
    KEY: API_KEY,
    Type: 'json',
    SCHUL_NM: schoolName,
  };

  try {
    const response = await axios.get(API_URL, { params });
    if (response.data.schoolInfo) 
    {
      const schoolData = response.data.schoolInfo[1].row[0];
      
      return {
        ENG_SCHUL_NM: schoolData.ENG_SCHUL_NM,
        ORG_RDNZC: schoolData.ORG_RDNZC,
      };
    } 
    else 
    {
      throw new Error('School not found');
    }
  } catch (error) {
    console.error('Error fetching school info:', error);

    return null;
  }
};
