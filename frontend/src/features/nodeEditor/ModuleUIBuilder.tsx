import { Box, Flex, Heading, useColorModeValue } from '@chakra-ui/react';
import _ from 'lodash';
import { useCallback } from 'react';
import { Connection, NodeProps, useReactFlow } from 'react-flow-renderer';
import ModuleHandle from './ModuleHandle';
import ParameterLabel from './components/ParameterLabel';
import ModuleParameterUIComponent from './ModuleParameterUIComponent';
import { Module, ModuleParameter } from './types';

function ModuleUIBuilder(props: NodeProps<Module>) {
  const { id: moduleId, data, selected } = props;
  const { moduleLabel, parameters } = data;

  const moduleBgColor = useColorModeValue('white', 'gray.800');
  const headerBgColor = useColorModeValue('gray.100', 'gray.700');
  const headerSelectedBgColor = useColorModeValue('blue.100', 'blue.700');
  const moduleSelectedBorderColor = useColorModeValue('blue.200', 'blue.800');

  const flow = useReactFlow();

  // Check if an in-progress connection is valid
  const isValidConnection = useCallback(
    (connection: Connection): boolean => {
      const edges = flow.getEdges();
      // Connection is invalid if target already has a connection
      if (
        edges.find((edge) => {
          return (
            edge.target === connection.target &&
            edge.targetHandle === connection.targetHandle
          );
        })
      ) {
        return false;
      }

      // Find the source and target nodes...
      if (connection.source && connection.target) {
        const sourceNode = flow.getNode(connection.source);
        const targetNode = flow.getNode(connection.target);

        // Conditional guards against undefined nodes/handles
        if (
          sourceNode &&
          targetNode &&
          connection.sourceHandle &&
          connection.targetHandle
        ) {
          // connection dataTypes must be the same for a connection
          return (
            sourceNode.data.parameters[connection.sourceHandle].dataType ===
            targetNode.data.parameters[connection.targetHandle].dataType
          );
        }
      }

      // Default to invalid
      return false;
    },
    [flow]
  );

  const isDependsOnConnected = useCallback(
    (parameter: ModuleParameter): boolean => {
      return parameter.dependsOn
        ? Boolean(
            flow
              .getEdges()
              .find(
                (edge) =>
                  edge.target === moduleId &&
                  edge.targetHandle ===
                    parameters[parameter.dependsOn as keyof ModuleParameter].id
              )
          )
        : true;
    },
    [flow, moduleId, parameters]
  );

  return (
    <Flex
      borderWidth={1}
      rounded={'md'}
      direction={'column'}
      cursor={'initial'}
      minWidth={'300px'}
      backgroundColor={moduleBgColor}
      borderColor={selected ? moduleSelectedBorderColor : undefined}
    >
      <Flex
        className={'node-drag-handle'}
        cursor={'move'}
        backgroundColor={selected ? headerSelectedBgColor : headerBgColor}
        borderTopRadius={'md'}
        p={2}
      >
        <Heading size={'sm'}>{moduleLabel}</Heading>
      </Flex>
      <Flex direction={'column'} gap={2} cursor={'initial'} p={2}>
        {_.map(parameters, (parameter, i) => {
          const { id, dataType, label, connectable } = parameter;
          const isDisabled = !(parameter.dependsOn
            ? Boolean(
                flow
                  .getEdges()
                  .find(
                    (edge) =>
                      edge.target === moduleId &&
                      edge.targetHandle ===
                        parameters[parameter.dependsOn as keyof ModuleParameter]
                          .id
                  )
              )
            : true);
          return (
            <Box key={i} position={'relative'} width={'100%'}>
              <ParameterLabel parameter={parameter} isDisabled={isDisabled}>
                {!(connectable && connectable.includes('target')) && (
                  <ModuleParameterUIComponent
                    parameter={parameter}
                    moduleId={moduleId}
                  />
                )}
              </ParameterLabel>
              {connectable &&
                connectable.map((c, i) => {
                  return (
                    <ModuleHandle
                      key={i}
                      handleType={c}
                      id={id}
                      dataType={dataType}
                      label={label}
                      isValidConnection={isValidConnection}
                    />
                  );
                })}
            </Box>
          );
        })}
      </Flex>
    </Flex>
  );
}

export default ModuleUIBuilder;
