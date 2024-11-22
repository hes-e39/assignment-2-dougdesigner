import DocumentComponent from "../components/documentation/DocumentComponent";

import Loading from "../components/generic/Loading";

/**
 * You can document your components by using the DocumentComponent component
 */
const Documentation = () => {
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between py-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl/7 font-bold text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Documentation
          </h2>
        </div>
      </div>
      <DocumentComponent
        title="Loading spinner "
        component={<Loading size="medium" color="#ffa2bf" />}
        propDocs={[
          {
            prop: "size",
            description: "Changes the size of the loading spinner",
            type: "string",
            defaultValue: "medium",
          },
        ]}
      />
    </div>
  );
};

export default Documentation;
