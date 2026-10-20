import { Box, Container, Flex, Heading, List, ListItem, SimpleGrid, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import service from '@content/service.json'

const ServiceSection: React.FC = () => {
  const { t } = useTranslation()
  const lineColor = useColorModeValue('gray.200', 'gray.700')
  const borderColor = useColorModeValue('gray.100', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const labelColor = useColorModeValue('gray.500', 'gray.400')

  const groups = [
    { key: 'conferences', title: t('service.conferences'), venues: service.conferences },
    { key: 'journals', title: t('service.journals'), venues: service.journals },
  ]

  return (
    <Box as="section" id="service" aria-labelledby="service-heading" w="full" scrollMarginTop="24">
      <Container maxW={['full', 'full', '7xl']} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4}>
          <Box h="2px" w="20px" bg="cyan.400" borderRadius="full" flexShrink={0} />
          <Heading as="h2" id="service-heading" size="md" fontWeight="semibold">
            {t('service.title')}
          </Heading>
          <Box flex="1" h="1px" bg={lineColor} />
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 8 }}>
          {groups.map(group => (
            <Box key={group.key} minW={0}>
              <Heading as="h3" fontSize="xs" fontWeight="medium" color={labelColor} mb={2}>
                {group.title}
              </Heading>
              <List spacing={0}>
                {group.venues.map(venue => (
                  <ListItem
                    key={venue}
                    py={2.5}
                    borderBottom="1px solid"
                    borderColor={borderColor}
                    fontSize="sm"
                    color={textColor}
                    overflowWrap="anywhere"
                  >
                    {venue}
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default ServiceSection
