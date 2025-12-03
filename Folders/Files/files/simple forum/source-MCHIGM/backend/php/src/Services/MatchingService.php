<?php
/**
 * Matching Service - Example implementation
 * 
 * Service for matching demands with resources
 */

namespace Mchigm\Services;

use Mchigm\Models\Demand;
use Mchigm\Models\Resource;

class MatchingService
{
    /**
     * Calculate match score between demand and resource
     * 
     * @param Demand $demand
     * @param Resource $resource
     * @return float Score between 0 and 1
     */
    public function calculateMatchScore(Demand $demand, Resource $resource): float
    {
        $score = 0.0;
        $weights = [
            'tags' => 0.4,
            'category' => 0.3,
            'availability' => 0.2,
            'location' => 0.1,
        ];

        // Tag matching
        $tagScore = $this->calculateTagScore($demand->getTags(), $resource->getTags());
        $score += $tagScore * $weights['tags'];

        // Category/Type matching
        $categoryScore = $this->calculateCategoryScore($demand->getCategory(), $resource->getType());
        $score += $categoryScore * $weights['category'];

        // Availability check
        $availabilityScore = $resource->isAvailable() ? 1.0 : 0.0;
        $score += $availabilityScore * $weights['availability'];

        // Location matching (simplified)
        $locationScore = $this->calculateLocationScore($demand, $resource);
        $score += $locationScore * $weights['location'];

        return round($score, 4);
    }

    /**
     * Calculate tag similarity score
     */
    private function calculateTagScore(array $demandTags, array $resourceTags): float
    {
        if (empty($demandTags) || empty($resourceTags)) {
            return 0.0;
        }

        $intersection = array_intersect($demandTags, $resourceTags);
        $union = array_unique(array_merge($demandTags, $resourceTags));

        // Jaccard similarity
        return count($intersection) / count($union);
    }

    /**
     * Calculate category/type match score
     */
    private function calculateCategoryScore(string $demandCategory, string $resourceType): float
    {
        // Define category-type mappings
        $mappings = [
            '志愿服务' => ['服务', '场地'],
            '教育公益' => ['教育', '服务', '物资'],
            '创业招募' => ['服务', '场地', '设备'],
            '校园公益' => ['物资', '教育', '场地'],
            '社区服务' => ['服务', '场地', '物资'],
        ];

        if (isset($mappings[$demandCategory])) {
            return in_array($resourceType, $mappings[$demandCategory]) ? 1.0 : 0.3;
        }

        return 0.0;
    }

    /**
     * Calculate location match score
     * 
     * NOTE: This is a placeholder implementation for demonstration purposes.
     * In a production environment, this would be replaced with:
     * - Geographic coordinate-based distance calculation
     * - City/region matching
     * - User preference-based location filtering
     * 
     * @param Demand $demand The demand to match
     * @param Resource $resource The resource to check
     * @return float Score between 0 and 1
     */
    private function calculateLocationScore(Demand $demand, Resource $resource): float
    {
        $location = $resource->getLocation();
        
        // Online resources always match (no location constraint)
        if (stripos($location, '线上') !== false || stripos($location, 'online') !== false) {
            return 1.0;
        }

        // Placeholder: return neutral score for demonstration
        // Real implementation would compare demand location with resource location
        return 0.5;
    }

    /**
     * Find best matching resources for a demand
     * 
     * @param Demand $demand
     * @param Resource[] $resources
     * @param int $limit Maximum number of matches to return
     * @param float $minScore Minimum score threshold
     * @return array Array of ['resource' => Resource, 'score' => float]
     */
    public function findMatches(
        Demand $demand, 
        array $resources, 
        int $limit = 10,
        float $minScore = 0.3
    ): array {
        $matches = [];

        foreach ($resources as $resource) {
            if (!$resource->isAvailable()) {
                continue;
            }

            $score = $this->calculateMatchScore($demand, $resource);
            
            if ($score >= $minScore) {
                $matches[] = [
                    'resource' => $resource,
                    'score' => $score,
                ];
            }
        }

        // Sort by score descending
        usort($matches, function ($a, $b) {
            return $b['score'] <=> $a['score'];
        });

        // Return top matches
        return array_slice($matches, 0, $limit);
    }

    /**
     * Get match recommendations for multiple demands
     * 
     * @param Demand[] $demands
     * @param Resource[] $resources
     * @return array
     */
    public function getRecommendations(array $demands, array $resources): array
    {
        $recommendations = [];

        foreach ($demands as $demand) {
            if (!$demand->isActive()) {
                continue;
            }

            $matches = $this->findMatches($demand, $resources, 3);
            
            if (!empty($matches)) {
                $recommendations[] = [
                    'demand' => $demand,
                    'matches' => $matches,
                ];
            }
        }

        return $recommendations;
    }
}
