#include <dlib/bayes_utils.h>
#include <dlib/graph_utils.h>
#include <dlib/graph.h>
#include <dlib/directed_graph.h>
#include <iostream>
#include <aws/lambda-runtime/runtime.h>
#include <nlohmann/json.hpp>

using namespace dlib;
using namespace std;
using namespace aws::lambda_runtime;
using json = nlohmann::json;

static invocation_response my_handler(invocation_request const& req)
{
  try
  {
    using namespace bayes_node_utils;

    auto data = json::parse(req.payload);

    directed_graph<bayes_node>::kernel_1a_c bn;

    bn.set_number_of_nodes(data["nodes"].size());

    std::map<string, int> idxs = {};
    for (unsigned i = 0; i < data["nodes"].size(); i++)
    {
      idxs[data["nodes"][i]["id"]] = i;
    }

    for (auto &node : data["nodes"])
    {
      const int idx = idxs[node["id"]];
      for (auto pid : node["parents"])
      {
        bn.add_edge(idxs[pid], idx);
      }
      set_node_num_values(bn, idx, node["states"].size());
    }

    assignment parent_state;

    for (auto &node : data["nodes"])
    {
      const int idx = idxs[node["id"]];
      if (node["parents"].size() == 0)
      {
        for (auto const& cpt : node["cpt"].items())
        {
	        const int value = (cpt.key() == "T" ? 1 : 0);
          set_node_probability(bn, idx, value, parent_state, cpt.value());
        }
      }
      else
      {
        for (auto pid : node["parents"])
        {
          parent_state.add(idxs[pid], 0);
        }
        for (auto const &cpt : node["cpt"])
	      {
          for (auto const& when : cpt["when"].items())
          {
            const int value = (when.value() == "T" ? 1 : 0);
            parent_state[idxs[when.key()]] = value;
          }
          for (auto const& then : cpt["then"].items())
          {
            const int value = (then.key() == "T" ? 1 : 0);
            set_node_probability(bn, idx, value, parent_state, then.value());
          }
	       }
         parent_state.clear();
      }
    }

    for (auto const& evidence : data["evidence"].items())
    {
      int idx = idxs[evidence.key()];
      const int value = (evidence.value() == "T" ? 1 : 0);
      set_node_value(bn, idx, value);
      set_node_as_evidence(bn, idx);
    }


    typedef dlib::set<unsigned long>::compare_1b_c set_type;
    typedef graph<set_type, set_type>::kernel_1a_c join_tree_type;
    join_tree_type join_tree;
    create_moral_graph(bn, join_tree);
    create_join_tree(join_tree, join_tree);
    bayesian_network_join_tree solution_with_evidence(bn, join_tree);

    json result = json({});
    for (const auto &node : data["nodes"])
    {
      result[node["id"].get<string>()] = solution_with_evidence.probability(idxs[node["id"]])(1);
    }
    return invocation_response::success(result.dump(), "application/json");
  }
  catch (std::exception& e)
  {
      return invocation_response::failure(e.what(), "Unknown error type");
  }
}

int main()
{
    run_handler(my_handler);
    return 0;
}
