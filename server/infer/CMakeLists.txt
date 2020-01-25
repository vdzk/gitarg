cmake_minimum_required(VERSION 3.10)

# set the project name
set(CMAKE_CXX_STANDARD 11)
project(infer LANGUAGES CXX)

find_package(aws-lambda-runtime)
add_subdirectory(../dlib-19.19/dlib dlib_build)

set(JSON_BuildTests OFF CACHE INTERNAL "")
add_subdirectory(../json-3.7.3 nlohmann_json)

# add the executable
add_executable(${PROJECT_NAME} main.cpp)

target_link_libraries(${PROJECT_NAME} PRIVATE dlib::dlib)

target_link_libraries(${PROJECT_NAME} PRIVATE AWS::aws-lambda-runtime)
target_compile_features(${PROJECT_NAME} PRIVATE "cxx_std_11")
target_compile_options(${PROJECT_NAME} PRIVATE "-Wall" "-Wextra")

target_link_libraries(${PROJECT_NAME} PRIVATE nlohmann_json::nlohmann_json)

# this line creates a target that packages your binary and zips it up
aws_lambda_package_target(${PROJECT_NAME})
