import React, { useState, useEffect } from "react";
import axios from "axios";
function App() {
  const [companies, setCompanies] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  // Fetch company data from backend when the component mounts
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/dashboard/getCompanyData"
        );
        console.log("Fetched data:", response.data); // Debugging log

        if (response.data.success) {
          setCompanies(response.data.data);
        } else {
          console.error("Failed to fetch company data");
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[#1a1a1a]">
      <div className="flex flex-col justify-start items-center h-screen w-4/5 bg-[#1a1a1a] overflow-hidden">
        <div className="bg-gradient-to-r from-zinc-700 to-gray-500 flex justify-center items-center h-full w-full rounded-lg p-4">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg h-full w-full p-4">
            <h1 className="sticky top-0 bg-[#1a1a1a] bg-gradient-to-r from-zinc-700 to-gray-500 text-center font-mono text-4xl mt-3 text-cyan-500 p-4 rounded-lg">
              Admin Dashboard
            </h1>
            <div className="overflow-y-auto h-full p-4">
              <div className="pb-20">
                {companies.map((company, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 text-white rounded-lg p-4 mb-4 shadow-lg"
                  >
                    <h2 className="text-xl font-bold">{company.name}</h2>
                    <p>Sector: {company.sector}</p>
                    <p>Country: {company.country}</p>
                    <div className="flex justify-end gap-2 mt-4">
                      {company.pdf1Url && (
                        <button
                          className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
                          onClick={() => setSelectedPDF(company.pdf1Url)}
                        >
                          Doc1
                        </button>
                      )}

                      {company.pdf2Url && (
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          onClick={() => setSelectedPDF(company.pdf2Url)}
                        >
                          Doc2
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedPDF && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white rounded-lg w-4/5 h-4/5 p-4 relative">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setSelectedPDF(null)}
            >
              Close
            </button>
            {console.log("Selected PDF URL:", selectedPDF)}
            <iframe
              src={selectedPDF}
              className="w-full h-full border-none"
              title="PDF Viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;