import Icons from "../../assets/Icons";

const NoDataFound = ({ label = "No Data Found" }) => {
  return (
    <div className="poject-nodatafound-main">
      <div
        className="nodatafound-icon"
        dangerouslySetInnerHTML={{ __html: Icons.no_data_found }}
      ></div>
      <div className="nodatafound-label">{label || "No Data Found"}</div>
    </div>
  );
};

export default NoDataFound;
