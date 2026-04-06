import { Box, Container, VStack, HStack, Text, Heading, Flex, Link, useColorModeValue } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'

/** Parse **bold** markers in text */
const renderBoldText = (text: string, color: string, boldColor: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <Text as="span" key={i} fontWeight="semibold" color={boldColor}>{part.slice(2, -2)}</Text>
    }
    return <Text as="span" key={i} color={color}>{part}</Text>
  })
}

const monthMap: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
}

const parsePeriodPart = (raw: string, fallbackMonth: number) => {
  const normalized = raw.trim()
  if (!normalized) return { year: 0, month: fallbackMonth }
  if (/present/i.test(normalized)) return { year: 9999, month: 12 }

  const monthMatch = normalized.match(/^([A-Za-z]+)\.?\s+(\d{4})$/)
  if (monthMatch) {
    const month = monthMap[monthMatch[1].toLowerCase()] ?? fallbackMonth
    return { year: Number(monthMatch[2]), month }
  }

  const yearMatch = normalized.match(/(\d{4})/)
  if (yearMatch) return { year: Number(yearMatch[1]), month: fallbackMonth }

  return { year: 0, month: fallbackMonth }
}

const getSortKey = (period: string) => {
  const [startRaw = '', endRaw = ''] = period.split(/\s*-\s*/)
  const end = parsePeriodPart(endRaw || startRaw, 12)
  const start = parsePeriodPart(startRaw, 1)
  return end.year * 1000000 + end.month * 10000 + start.year * 100 + start.month
}

const JourneySection: React.FC = () => {
  const { t } = useTranslation()
  const { about } = useLocalizedData()
  const textColor = useColorModeValue('gray.500', 'gray.400')
  const boldColor = useColorModeValue('gray.700', 'gray.200')
  const headingColor = useColorModeValue('gray.800', 'gray.100')
  const lineColor = useColorModeValue('gray.200', 'gray.700')
  const dotBorder = useColorModeValue('gray.300', 'gray.600')
  const dotBg = useColorModeValue('white', 'gray.800')
  const tagBg = useColorModeValue('gray.100', 'gray.800')

  if (!about.journeyPhases || about.journeyPhases.length === 0) return null

  const sortedJourneyPhases = useMemo(
    () => [...about.journeyPhases!].sort((a, b) => getSortKey(b.period) - getSortKey(a.period)),
    [about.journeyPhases]
  )

  return (
    <Box w="full">
      <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
        <Flex align="center" gap={3} w="full" mb={4}>
          <Box h="2px" w="20px" bg="cyan.400" borderRadius="full" flexShrink={0} />
          <Heading size={["sm", "md"]} fontWeight="semibold">{t('about.myJourney')}</Heading>
          <Box flex="1" h="1px" bg={lineColor} />
        </Flex>

        <Box w="full" position="relative">
          <Box position="absolute" left={["7px", "7px", "7px"]} top="12px" bottom="12px" w="1px" bg={lineColor} />

          <VStack spacing={0} align="stretch">
            {sortedJourneyPhases.map((phase, index) => (
              <Flex key={index} gap={[3, 4]} align="start" py={3} position="relative">
                <Box flexShrink={0} mt="6px">
                  <Box
                    w="14px" h="14px" borderRadius="full" border="2px solid"
                    borderColor={index === 0 ? 'cyan.400' : dotBorder}
                    bg={index === 0 ? 'cyan.400' : dotBg}
                  />
                </Box>
                <Box flex={1} pb={2}>
                  <HStack spacing={2} mb={1} flexWrap="wrap">
                    <Text fontSize="2xs" fontFamily="mono" color="cyan.400" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
                      {phase.period}
                    </Text>
                    <Text fontSize="2xs" color={useColorModeValue('gray.400', 'gray.600')}>/</Text>
                    <Text fontSize="2xs" fontFamily="mono" color={useColorModeValue('gray.400', 'gray.500')}>{phase.org}</Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="semibold" color={headingColor} mb={1}>{phase.title}</Text>
                  <Text fontSize="xs" lineHeight="tall" mb={2}>
                    {renderBoldText(phase.description, textColor, boldColor)}
                  </Text>
                  {phase.tags && (
                    <HStack spacing={1.5} flexWrap="wrap">
                      {phase.tags.map((tag) => (
                        <Text key={tag} fontSize="2xs" fontFamily="mono" color={textColor} px={1.5} py={0.5} bg={tagBg} borderRadius="sm">
                          {tag}
                        </Text>
                      ))}
                    </HStack>
                  )}
                </Box>
              </Flex>
            ))}
            {/* View all link */}
            <Flex gap={[3, 4]} align="start" py={3} position="relative">
              <Box flexShrink={0} mt="6px">
                <Box w="14px" h="14px" borderRadius="full" border="2px dashed" borderColor={dotBorder} />
              </Box>
              <Link href="/experience" _hover={{ textDecoration: 'none' }}>
                <HStack spacing={2} color={textColor} fontSize="xs" fontFamily="mono" transition="all 0.15s" _hover={{ color: 'cyan.400' }} mt="3px">
                  <Text>{t('about.viewAllExperience')}</Text>
                  <Text>→</Text>
                </HStack>
              </Link>
            </Flex>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}

export default JourneySection
